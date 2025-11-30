import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TeamMemberAssembler } from '../mappers/team-member.assembler';
import { TeamMember } from '../models/team-member.entity';
import { TeamMemberResource } from '../models/team.resource';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private baseUrl = `${environment.apiBaseUrl}/teams`;

  constructor(private http: HttpClient) {}

  addTeamMemberToTeam(teamId: number, teamMember: TeamMember): Observable<TeamMember> {
    const createResource = TeamMemberAssembler.toResourceFromEntity(teamMember);
    return this.http.post<TeamMemberResource>(`${this.baseUrl}/teams/${teamId}/members`, createResource).pipe(
      map(resource => TeamMemberAssembler.toEntityFromResource(resource))
    );
  }

  getTeamMemberById(id: number): Observable<TeamMember> {
    return this.http.get<TeamMemberResource>(`${this.baseUrl}/members/${id}`).pipe(
      map(resource => TeamMemberAssembler.toEntityFromResource(resource))
    );
  }

  deleteTeamMember(teamId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/teams/${teamId}/members/${memberId}`);
  }
}
